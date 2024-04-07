class LocalStorageService {
  getLocalAccessToken = () => localStorage.getItem('accessToken') || ''
  removeLocalAccessToken = () => localStorage.removeItem('accessToken')
  saveLocalAccessToken = (token: string) => localStorage.setItem('accessToken', token)

  getLocalRefreshToken = () => localStorage.getItem('refreshToken') || ''
  saveLocalRefreshToken = (token: string) => localStorage.setItem('refreshToken', token)
  removeLocalRefreshToken = () => localStorage.removeItem('refreshToken')
}

export default new LocalStorageService()
