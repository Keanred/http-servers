export type Middleware = (req: import('express').Request, res: import('express').Response, next: import('express').NextFunction) => void;
