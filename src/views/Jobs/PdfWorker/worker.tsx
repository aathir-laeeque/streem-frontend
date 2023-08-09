import { pdf } from '@react-pdf/renderer';
import PDFMerger from 'pdf-merger-js';
import * as Comlink from 'comlink';
import { v4 as uuidv4 } from 'uuid';
import React from 'react';
import { MyPrintObjectChangeLogs } from '../../Ontology/PrintObjectChangeLogs/PrintObjectChangeLogs';
import { JobPdf } from '../PrintJob/JobPdf';
import { JobAuditLogsPdf } from '../PrintJobAuditLogs/JobAuditLogsPdf';
import { MyCustomViewJobAuditLogs } from '../PrintJobLogs/PrintJobLogs';
import { Font } from '@react-pdf/renderer';
import Nunito200 from '#assets/fonts/nunito/nunito-v14-latin-200.ttf';
import Nunito300 from '#assets/fonts/nunito/nunito-v14-latin-300.ttf';
import Nunito400 from '#assets/fonts/nunito/nunito-v14-latin-regular.ttf';
import Nunito600 from '#assets/fonts/nunito/nunito-v14-latin-600.ttf';
import Nunito700 from '#assets/fonts/nunito/nunito-v14-latin-700.ttf';
import Nunito800 from '#assets/fonts/nunito/nunito-v14-latin-800.ttf';
import Nunito900 from '#assets/fonts/nunito/nunito-v14-latin-900.ttf';
import { cloneDeep, noop } from 'lodash';

Font.register({
  family: 'Nunito',
  fonts: [
    { src: Nunito400 },
    { src: Nunito200, fontWeight: 200 },
    { src: Nunito300, fontWeight: 300 },
    { src: Nunito600, fontWeight: 600 },
    { src: Nunito700, fontWeight: 700 },
    { src: Nunito800, fontWeight: 800 },
    { src: Nunito900, fontWeight: 900 },
  ],
});

Font.registerEmojiSource({
  format: 'png',
  url: 'https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/',
});

export let progressCb = console.info;

function progress(count: number, total: number, name: string, stageNo: number) {
  progressCb((count / total) * 100, name, stageNo);
}

const generateSingle = async (data: any) => {
  let pdfBuilder: any;

  switch (data.type) {
    case 'JOB':
      const {
        data: { checklist },
      } = data;
      let count = -1;
      pdfBuilder = {};
      const duplicatedStages = cloneDeep(checklist.stages);

      //  https://github.com/diegomura/react-pdf/issues/310 :: await first PDF promise to be resolved, then u can execute next calls in parallel in any number desired,
      data.data.checklist.stages = [duplicatedStages[0]];
      progress(++count, duplicatedStages.length, duplicatedStages[0].name, 1);
      const a = pdf(<JobPdf {...data} renderInitialPage />);
      const firstStage = await a.toBlob();

      duplicatedStages.splice(0, 1);

      const merger = new PDFMerger();

      const arr = new Uint8Array(await firstStage.arrayBuffer());
      await merger.add(arr);

      // SERIAL APPROACH
      for (let i = 0; i < duplicatedStages.length; i++) {
        const stage = duplicatedStages[i];
        data.data.checklist.stages = [stage];
        const a = pdf(<JobPdf {...data} />);
        const b = await a.toBlob();
        const arr = new Uint8Array(await b.arrayBuffer());
        await merger.add(arr);
        progress(++count, duplicatedStages.length, stage.name, i + 2);
      }

      const mergedPdfBuffer = await merger.saveAsBuffer();
      return new Blob([mergedPdfBuffer], { type: 'application/pdf' });

    case 'JOB_AUDIT_LOGS':
      pdfBuilder = pdf(<JobAuditLogsPdf {...data} />);
      break;

    case 'CUSTOM_VIEW_JOB_LOGS':
      pdfBuilder = pdf(<MyCustomViewJobAuditLogs {...data} />);
      break;

    case 'OBJECT_CHANGE_LOGS':
      pdfBuilder = pdf(<MyPrintObjectChangeLogs {...data} />);
      break;

    default:
      break;
  }
  const blob = await pdfBuilder.toBlob();
  return blob;
};

const onProgress = (cb) => (progressCb = cb);

Comlink.expose({
  generateSingle,
  onProgress,
});

export const pdfWorker = (request: any, cb = noop) => {
  const worker = new Worker(new URL('./worker.tsx', import.meta.url));
  const pdfWorker = Comlink.wrap(worker);
  pdfWorker.onProgress(Comlink.proxy(cb));
  pdfWorker.generateSingle(request).then((pdfBlob: Blob) => {
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(pdfBlob);
    link.download = uuidv4() + '.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.close();
  });
};
