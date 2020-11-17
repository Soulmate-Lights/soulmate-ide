import {
  usart0Config,
  AVRUSART,
  avrInstruction,
  AVRTimer,
  CPU,
  timer0Config,
  AVRIOPort,
  portBConfig,
} from "avr8js";
import { loadHex } from "./intelhex";

// ATmega328p params
const FLASH = 0x40000;

export class AVRRunner {
  readonly program = new Uint16Array(FLASH);
  readonly cpu: CPU;
  readonly timer: AVRTimer;
  readonly portB: AVRIOPort;
  readonly usart: AVRUSART;
  readonly speed = 16e6; // 16 MHZ
  private stopped = false;

  constructor(hex: string) {
    loadHex(hex, new Uint8Array(this.program.buffer));
    this.cpu = new CPU(this.program, 0x2200);
    this.timer = new AVRTimer(this.cpu, {
      ...timer0Config,
      compAInterrupt: 0x02a,
      compBInterrupt: 0x02c,
      ovfInterrupt: 0x02e,
    });
    this.portB = new AVRIOPort(this.cpu, portBConfig);
    this.usart = new AVRUSART(this.cpu, usart0Config, this.speed);
  }

  async execute(callback: (cpu: CPU) => void) {
    this.stopped = false;
    for (;;) {
      avrInstruction(this.cpu);
      this.timer.tick();
      if (this.cpu.cycles % 500000 === 0) {
        callback(this.cpu);
        await new Promise((resolve) => setTimeout(resolve, 0));
        if (this.stopped) {
          break;
        }
      }
    }
  }

  stop() {
    this.stopped = true;
  }
}
