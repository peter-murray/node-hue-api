import { ApiDefinition } from './http/ApiDefinition';
import { resourceLinksApi } from './http/endpoints/resourceLinks';
import { model } from '@peter-murray/hue-bridge-model';
import { Api } from './Api';

type ResourceLinkId = string | model.ResourceLink
type LooseObject = { [key: string]: any };

export class ResourceLinks extends ApiDefinition {

  constructor(hueApi: Api) {
    super(hueApi);
  }

  getAll(): Promise<model.ResourceLink[]> {
    return this.execute(resourceLinksApi.getAll);
  }

  getResourceLink(id: ResourceLinkId): Promise<model.ResourceLink> {
    return this.execute(resourceLinksApi.getResourceLink, {id: id});
  }

  getResourceLinkByName(name: string): Promise<model.ResourceLink[]> {
    return this.getAll()
      .then(resourceLinks => {
        return resourceLinks.filter(resourceLink => resourceLink.name === name);
      });
  }

  createResourceLink(resourceLink: model.ResourceLink): Promise<model.ResourceLink> {
    const self = this;

    return self.execute(resourceLinksApi.createResourceLink, {resourceLink: resourceLink})
      .then((result: LooseObject) => {
        return self.getResourceLink(result.id);
      });
  }

  deleteResourceLink(id: ResourceLinkId): Promise<boolean> {
    return this.execute(resourceLinksApi.deleteResourceLink, {id: id});
  }

  updateResourceLink(resourceLink: model.ResourceLink): Promise<LooseObject> {
    return this.execute(resourceLinksApi.updateResourceLink, {id: resourceLink.id, resourceLink: resourceLink});
  }
}