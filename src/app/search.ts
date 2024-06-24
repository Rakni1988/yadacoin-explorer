// search.ts
export class Search {
  term: string;

  constructor(params: { term?: string } = {}) {
    this.term = params.term || '';
  }
}