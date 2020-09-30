import { actionSpreader } from '#store';

import {
  FileUploadAction,
  UploadFileArgs,
  FileUploadSucessArgs,
} from './types';

export const uploadFile = ({ formData }: UploadFileArgs) =>
  actionSpreader(FileUploadAction.UPLOAD_FILE, { formData });

export const uploadFileSuccess = (fileData: FileUploadSucessArgs) =>
  actionSpreader(FileUploadAction.UPLOAD_FILE_SUCCESS, { fileData });

export const uploadFileError = (error: any) =>
  actionSpreader(FileUploadAction.UPLOAD_FILE_ERROR, { error });

export const resetFileUpload = () =>
  actionSpreader(FileUploadAction.RESET_FILE_UPLOAD);
