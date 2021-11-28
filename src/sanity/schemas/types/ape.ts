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
    { title: 'xchain URL', name: 'xchainUrl', type: 'url' },
    { name: 'order', title: 'Order', type: 'number', hidden: true },
  ],
};

export default ape;
