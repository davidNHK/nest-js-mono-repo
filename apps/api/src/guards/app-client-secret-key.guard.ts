import { FindApplicationService } from '@api/modules/application/services/find-application.service';
import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';

@Injectable()
export class AppClientSecretKeyGuard implements CanActivate {
  constructor(private findAppService: FindApplicationService) {}

  async canActivate(context: ExecutionContext) {
    const httpRequest = context.switchToHttp().getRequest();
    const { 'x-client-application': appName, 'x-client-token': appSecretKey } =
      httpRequest.headers;
    if (!appName || !appSecretKey) return false;
    const app = await this.findAppService.findByName(appName).catch(() => null);
    if (!app) return false;
    return app.clientSecretKey.includes(appSecretKey);
  }
}
