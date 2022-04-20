import AppError from '../errors/AppError';
import './enviroment';

export const opmCologId = Number.parseInt(String(process.env.OPM_COLOG_ID), 10);
export const opmNUGCMOTId = Number.parseInt(
  String(process.env.OPM_NUGCMOT_ID),
  10,
);

if (Number.isNaN(opmCologId) || Number.isNaN(opmNUGCMOTId)) {
  console.log('Sistema precisa dos Ids da Colog e da NUGCMOT');
  process.exit();
}
