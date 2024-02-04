/**
 * Abstract class to convert mongo document to DTO
 */
export abstract class Mapper<I, O> {
  abstract convert(input: I): Promise<O>;
}
