const series = {
  title: 'Series',
  name: 'series',
  type: 'document',
  fields: [
    { title: 'Series Number', name: 'series', type: 'number' },
    {
      title: 'Apes',
      name: 'apes',
      type: 'array',
      of: [{ type: 'reference', name: 'ape', to: [{ type: 'ape' }] }],
      validation: (Rule: any) => Rule.max(69),
    },
  ],
};

export default series;
