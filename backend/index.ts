import { App } from "flusso-core";
import { BaseRoute } from "flusso-core";
import { ContextProvider } from "flusso-core";
import { AppContext } from "flusso-core";
import { Router } from "express";
import {
  AuthRoute, InstituteRoute, StudentRoute, AttendanceRoute,
  ResultRoute, AiRoute, FeeRoute, NoticeRoute, SuperAdminRoute
} from "./Routes/index.routes";
import { EduBrainConfig } from "./Config";

export class EduBrainApp extends App {
  appRouter: BaseRoute<any>[];
  ctx: AppContext;

  constructor() {
    super("/api");
    this.ctx = ContextProvider.initialize(new EduBrainConfig());
    this.ctx?.register<Router>("router", this.router);
    this.appRouter = [
      new AuthRoute(),
      new InstituteRoute(),
      new StudentRoute(),
      new AttendanceRoute(),
      new ResultRoute(),
      new AiRoute(),
      new FeeRoute(),
      new NoticeRoute(),
      new SuperAdminRoute(),
    ];
    this.initDatabase();
    this.initHttpServer();
  }
}

new EduBrainApp();
