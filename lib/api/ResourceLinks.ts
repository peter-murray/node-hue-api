import { ApiDefinition } from './http/ApiDefinition';
import { resourceLinksApi } from './http/endpoints/resourceLinks';
import { ResourceLink } from '@peter-murray/hue-bridge-model/lib/esm/model';

type ResourceLinkId = string | ResourceLink
type LooseObject = { [key: string]: any };

export class ResourceLinks extends ApiDefinition {

  constructor(hueApi) {
    super(hueApi);
  }

  getAll(): Promise<ResourceLink[]> {
    return this.execute(resourceLinksApi.getAll);
  }

  getResourceLink(id: ResourceLinkId): Promise<ResourceLink> {
    return this.execute(resourceLinksApi.getResourceLink, {id: id});
  }

  getResourceLinkByName(name: string): Promise<ResourceLink[]> {
    return this.getAll()
      .then(resourceLinks => {
        return resourceLinks.filter(resourceLink => resourceLink.name === name);
      });
  }

  createResourceLink(resourceLink: ResourceLink): Promise<ResourceLink> {
    const self = this;

    return self.execute(resourceLinksApi.createResourceLink, {resourceLink: resourceLink})
      .then((result: LooseObject) => {
        return self.getResourceLink(result.id);
      });
  }

  deleteResourceLink(id: ResourceLinkId): Promise<boolean> {
    return this.execute(resourceLinksApi.deleteResourceLink, {id: id});
  }

  updateResourceLink(resourceLink: ResourceLink): Promise<LooseObject> {
    return this.execute(resourceLinksApi.updateResourceLink, {id: resourceLink.id, resourceLink: resourceLink});
  }
};