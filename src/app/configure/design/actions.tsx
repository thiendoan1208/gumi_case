"use server";

import { db } from "@/db";
import {
  CaseColor,
  CaseFinish,
  CaseMaterial,
  PhoneModel,
} from "@/generated/prisma";

type saveConfiguration = {
  color: CaseColor;
  finish: CaseFinish;
  material: CaseMaterial;
  model: PhoneModel;
  configID: string;
};

export async function SaveConfig({
  color,
  finish,
  material,
  model,
  configID,
}: saveConfiguration) {
  await db.configuration.update({
    where: { id: configID },
    data: { color, finish, material, model },
  });
}

export type { saveConfiguration };
