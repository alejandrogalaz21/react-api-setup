export function aclSelector({ auth }) {
  const per = auth.permissions
  return {
    user: auth.user,
    permissions: per.map(p => {
      const { module, ...props } = p
      return {
        ...props,
        url: module.url.app,
        module: module.name
      }
    })
  }
}
