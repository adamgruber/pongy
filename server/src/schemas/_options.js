/* Shared schema options */
export default {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'modified_at',
  },
  toJSON: {
    virtuals: true,
  },
  versionKey: false,
};
