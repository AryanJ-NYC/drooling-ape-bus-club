const ape = {
  title: 'Apes',
  name: 'ape',
  type: 'document',
  fields: [
    {
      title: 'Image',
      name: 'image',
      type: 'image',
      options: { hotspot: true },
    },
    { title: 'Name', name: 'name', type: 'string' },
    {
      title: 'Artists',
      name: 'artists',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'artist' } }],
    },
    { title: 'Series', name: 'series', type: 'number' },
    { name: 'order', title: 'Order', type: 'number', hidden: true },
  ],
};

export default ape;
