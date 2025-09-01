class Network {
    Socket = WebSocket.prototype;

    constructor() {
        
    }

    ConnectToServer(url) {
        this.Socket = new WebSocket(url);
        
        this.Socket.onopen = (ev) => {
            console.log('Connected to ' + url);
        }
        this.Socket.onclose = (ev) => {
            console.log('Disconnected from ' + url);
        }
        this.Socket.onmessage = (ev) => {
            let Data = JSON.parse(ev.data);
            let entity;

            switch (Data.name) {
                case 'ShareClientId':
                    globalThis.Engine.ClientId = Data.ClientId;
                    break;
                case 'ShareEntity':
                    globalThis.Engine.AddEntity(Entity.FromNetwork(Data.entity))
                    break;
                case 'UnShareEntity':
                    globalThis.Engine.DeleteEntity(Entity.FromNetwork(Data.entity));
                    break;
                case 'ChangeComponent':
                    entity = globalThis.Engine.GetEntity(Data.entity.UniqueId);
                    let components = Data.entity.Components

                    for (let name in components) {
                        entity.AddComponent(name);
            
                        for (let key in components[name]) {
                            let property = components[name];
            
                            if ((typeof property[key]) == 'object') {
                                for (let pkey in property) {
                                    if (typeof property[pkey] == 'object') {
                                        for (let skey in property[pkey]) {
                                            entity.GetComponent(name)[key][skey] = property[key][skey];
                                        }
                                    } else {
                                        entity.GetComponent(name)[key][pkey] = property[pkey];
                                    }
                                }
                            } else {
                                entity.GetComponent(name)[key] = property[key];
                            }
                        }
                    }
                    break;
            
                default:
                    break;
            }
        }
    }

    Write(Data) {
        this.Socket.send(JSON.stringify(Data));
    }

    ChangeComponent(component) {
        let Components = {}

        Components[component.constructor.name] = component;

        this.Write({
            name: 'ChangeComponent',
            Components: Components
        });
    }
}