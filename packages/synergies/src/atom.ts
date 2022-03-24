import { Synergy } from "./synergy";
import { ATOM_CONSTRUCTOR } from "./helpers";

export class Atom<T = any> extends Synergy<[T]> {
  public readonly id: symbol;

  constructor(public readonly defaultValue: T) {
    super(ATOM_CONSTRUCTOR);
    this.id = Symbol();
  }
}
