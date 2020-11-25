import { Activity } from '#Composer/checklist.types';
export enum FileUploadAction {
  UPLOAD_FILE = '@@file-upload/UPLOAD_FILE',
  UPLOAD_FILE_ERROR = '@@file-upload/UPLOAD_FILE_ERROR',
  UPLOAD_FILE_SUCCESS = '@@file-upload/UPLOAD_FILE_SUCCESS',
}

export type UploadFileArgs = {
  formData: FormData;
  activity?: Activity;
  isCorrectingError: boolean;
};
