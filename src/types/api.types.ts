// API Response Types
export interface MethodRecordResponse {
  record: string
  methodChains: MethodChainResponse[]
  code: number
}

export interface MethodChainResponse {
  id: number
  threadName: string
  message: string | null
  methodChain: string
  callChainId: number
}

export interface Parameter {
  name: string
  type: string
}

export interface CalledMethod {
  methodName: string
  className: string
  packageName: string
  lineNumber: number
}

export interface MethodCall {
  id: number
  callChainId: number
  method: string
  inboundCall: boolean
  args: any
  returnValue: any
  target: any
  timestamp: any
}

export interface MermaidResponse {
  code: string
  message: string
  mermaidCode?: string
}

export interface MethodDetailResponse {
  id?: string
  projectId?: string
  methodName?: string
  methodSignature?: string
  className?: string
  packageName?: string
  returnType?: string
  parameters?: Parameter[]
  modifiers?: string[]
  startLine?: number
  endLine?: number
  methodBody?: string
  calledMethods?: CalledMethod[]
  createdAt?: string
  updatedAt?: string
  // Properties expected by UI components
  method?: string
  args?: any
  returnValue?: any
  target?: any
  timestamp?: any
}

export interface InitConfigResponse {
  projectId: string
  projectName: string
  projectPath: string
  scanPath: string
  createdAt: string
  updatedAt: string
  packageNames?: string[]
  status?: boolean
}

export interface RecordResponse {
  id: string
  projectId: string
  record: string
  createdAt: string
  updatedAt: string
}

export interface RecordRequest {
  projectId: string
  config: string[]
  start: boolean
}

export interface ProjectConfig {
  projectId: string
  projectName: string
  projectPath: string
  scanPath: string
  createdAt: string
  updatedAt: string
}

export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

export interface PageResponse<T = any> {
  list: T[]
  total: number
  page: number
  size: number
}

// Chart and Visualization Types
export interface ChartData {
  labels: string[]
  datasets: ChartDataset[]
}

export interface ChartDataset {
  label: string
  data: number[]
  backgroundColor?: string | string[]
  borderColor?: string | string[]
  borderWidth?: number
}

// Component Props Types
export interface ChartCardProps {
  title: string
  chartType: 'bar' | 'line' | 'pie' | 'doughnut'
  data: ChartData
  height?: number
}

export interface MethodChainCardProps {
  methodChain: MethodChainResponse
  onGenerateChart: (methodChain: MethodChainResponse) => void
}

export interface RecordActionProps {
  projectId: string
}

// Store Types
export interface AppState {
  loading: boolean
  error: string | null
  currentProject: ProjectConfig | null
}

export interface MethodState {
  methodRecords: MethodRecordResponse[]
  currentMethodChain: MethodChainResponse | null
  mermaidCode: string
  loading: boolean
}

// Utility Types
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

export interface HttpRequestConfig {
  url: string
  method: HttpMethod
  params?: Record<string, any>
  data?: any
  headers?: Record<string, string>
  timeout?: number
}

export interface HttpResponse<T = any> {
  data: T
  status: number
  statusText: string
  headers: Record<string, string>
  config: HttpRequestConfig
}

// Error Types
export interface ApiError {
  code: number
  message: string
  details?: any
}

export interface ValidationError {
  field: string
  message: string
  value?: any
}

// Form Types
export interface ProjectConfigForm {
  projectName: string
  projectPath: string
  scanPath: string
}

export interface MethodFilterForm {
  className?: string
  packageName?: string
  methodName?: string
  returnType?: string
}

// Export all types as a namespace for easier importing
export namespace MermaidTypes {
  export type MethodRecord = MethodRecordResponse
  export type MethodChain = MethodChainResponse
  export type MethodDetail = MethodDetailResponse
  export type Project = ProjectConfig
  export type Record = RecordResponse
  export type ChartDatasetType = ChartDataset
  export type ChartDataType = ChartData
}