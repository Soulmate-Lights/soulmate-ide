export default interface Config {
  rows: number;
  cols: number;
  serpentine: boolean;
  ledType: string; // = "APA102",
  milliamps: number; //  = 700,
  button: number;
  data: number;
  clock: number;
}
