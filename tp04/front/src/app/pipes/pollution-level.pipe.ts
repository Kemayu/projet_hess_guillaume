import { Pipe, PipeTransform } from '@angular/core';
import { PollutionLevel, pollutionLevel } from '../utils/pollution-level';

@Pipe({ name: 'pollutionLevel' })
export class PollutionLevelPipe implements PipeTransform {
  transform(index: number | null | undefined): PollutionLevel | '' {
    return pollutionLevel(index);
  }
}
