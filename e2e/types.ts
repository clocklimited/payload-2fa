export interface ISetupArgs {
	adminRoute?: string
	apiRoute?: string
	disableAccessWrapper?: boolean
	forceSetup?: boolean
	overrideBaseURL?: string
	overridePort?: number
	serverURL?: string
}

export type ISetupResult = Promise<{
	baseURL: string
	port: number
	teardown: () => Promise<void>
}>
