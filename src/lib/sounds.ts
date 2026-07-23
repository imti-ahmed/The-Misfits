import { defineSound } from '@web-kits/audio';
import { copy, error, hover, expand } from '@/audio/soft';
import { swoosh, success, click } from '@/audio/playful';

export const sounds = {
  swoosh:  defineSound(swoosh),
  copy:    defineSound(copy),
  success: defineSound(success),
  error:   defineSound(error),
  click:   defineSound(click),
  hover:   defineSound(hover),
  chime:   defineSound(expand),
};
