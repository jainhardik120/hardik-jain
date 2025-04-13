import { parseAsInteger, parseAsString } from 'nuqs/server';

export const tagsParser = {
  tag: parseAsString.withDefault(''),
  page: parseAsInteger.withDefault(1),
  limit: parseAsInteger.withDefault(10),
};
