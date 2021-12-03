import { FindApplicationService } from '@api/modules/application/services/find-application.service';
import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppServerSecretKeyGuard implements CanActivate {
  constructor(private findAppService: FindApplicationService) {}

  async canActivate(context: ExecutionContext) {
    const httpRequest = context.switchToHttp().getRequest();
    const { 'x-app': appName, 'x-app-token': appSecretKey } =
      httpRequest.headers;
    if (!appName || !appSecretKey) return false;
    const app = await this.findAppService.findByName(appName).catch(() => null);
    if (!app) return false;
    return app.serverSecretKey.includes(appSecretKey);
  }
}
