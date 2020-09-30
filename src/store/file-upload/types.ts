import { uploadFileError, uploadFileSuccess, resetFileUpload } from './actions';

export enum FileUploadAction {
  UPLOAD_FILE = '@@file-upload-new/UPLOAD_FILE',
  UPLOAD_FILE_ERROR = '@@file-upload-new/UPLOAD_FILE_ERROR',
  UPLOAD_FILE_SUCCESS = '@@file-upload-new/UPLOAD_FILE_SUCCESS',
  RESET_FILE_UPLOAD = '@@file-upload-new/RESET_FILE_UPLOAD',
}

export type UploadFileArgs = {
  formData: FormData;
};
export type FileUploadState = {
  data: any;
  error: any;
};

export type FileUploadSucessArgs = {
  fileName: string;
  type: string;
  link: string;
};

export type FileUploadActionType = ReturnType<
  typeof uploadFileError | typeof uploadFileSuccess | typeof resetFileUpload
>;
