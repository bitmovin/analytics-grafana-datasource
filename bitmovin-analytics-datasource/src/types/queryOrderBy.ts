import { QueryAttribute } from './queryAttributes';
import { QueryAdAttribute } from './queryAdAttributes';

export type QuerySortOrder = 'ASC' | 'DESC';

export type QueryOrderBy = {
  name: QueryAttribute | QueryAdAttribute;
  order: QuerySortOrder;
};

export type SelectableQueryOrderBy = {
  name: QueryAttribute | QueryAdAttribute | '';
  order: QuerySortOrder;
};
