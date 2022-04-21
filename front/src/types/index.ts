export type User = {
  id: string
  email: string
  role: string
  createdAt: string
  updatedAt: string
}

export type UserWithAccessToken = {
  accessToken: string
  user: User
}

export type Credentials = {
  email: string
  password: string
}
