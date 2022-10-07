import { Router } from 'express'
import { routes as allRoutes } from './all'

export const routes = Router()
routes.all('*', allRoutes)
