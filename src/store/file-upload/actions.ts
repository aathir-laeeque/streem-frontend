import { actionSpreader } from '#store';

import {
  FileUploadAction,
  FileUploadSucessArgs,
  UploadFileArgs,
} from './types';

export const uploadFile = ({ formData }: UploadFileArgs) =>
  actionSpreader(FileUploadAction.UPLOAD_FILE, { formData });

export const uploadFileSuccess = (fileData: FileUploadSucessArgs) =>
  actionSpreader(FileUploadAction.UPLOAD_FILE_SUCCESS, { fileData });

export const uploadFileError = (error: string) =>
  actionSpreader(FileUploadAction.UPLOAD_FILE_ERROR, { error });

export const resetFileUpload = () =>
  actionSpreader(FileUploadAction.RESET_FILE_UPLOAD);
