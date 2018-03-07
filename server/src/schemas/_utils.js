/*
 * Apply virtuals to a schema
 */
export const assignVirtuals = (schema, virtuals) => {
  Object.keys(virtuals).forEach(virtualProp => {
    const getter = virtuals[virtualProp];
    schema.virtual(virtualProp).get(getter);
  });
}
