// @ts-expect-error
import schemaTypes from 'all:part:@sanity/base/schema-type'; // eslint-disable-line
// @ts-expect-error
import createSchema from 'part:@sanity/base/schema-creator'; // eslint-disable-line
import ape from './types/ape';
import artist from './types/artist';
import series from './types/series';

export default createSchema({
  name: 'drooling-ape-bus-club',
  types: schemaTypes.concat([ape, artist, series]),
});
