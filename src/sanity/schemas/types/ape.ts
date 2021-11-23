const ape = {
  title: 'Apes',
  name: 'ape',
  type: 'document',
  fields: [
    // { title: 'Artists', name: 'artists', type: 'array', of: [{ type: 'artist' }] },
    {
      title: 'Image',
      name: 'image',
      type: 'image',
      options: { hotspot: true },
    },
  ],
};

export default ape;
