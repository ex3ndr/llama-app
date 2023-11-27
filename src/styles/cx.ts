import cs from 'classnames';

type Value = string | number | boolean | undefined | null;
type Mapping = Record<string, unknown>;
interface ArgumentArray extends Array<Argument> { }
type Argument = Value | Mapping | ArgumentArray;

export function cx(...args: ArgumentArray): string {
    return cs(...args);
}