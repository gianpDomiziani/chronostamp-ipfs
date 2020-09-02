import all from 'it-all';


const IPFS = require('ipfs');

const { BufferList } = require('bl')

export class MyIPFS {
  static node: any = {};

  static async start(): Promise<void> {
    console.log('Hi static');
    this.node = await IPFS.create();
  }

  static async makeAsset(name: string): Promise<any> {

    let asset = { BestPhD: name };
    const result = JSON.stringify(asset);

    const version = await this.node.version();
    console.log(`IPFS started, version: ${version.version}`);

    //write to ipfs
   //await this.node.files.mkdir(`/enrico`, { parentes: true });

    const writeTo = `/enrico/${name}.json`;

    await this.node.files.write(writeTo, result, { create: true });
    // ...

    // let cid = await this.node.dag.put(asset);

    const results = await all(this.node.files.ls(`/enrico/`));

    const stat = await this.node.files.stat(`/enrico/${name}.json`);

    const stats = JSON.stringify(stat)

     console.log('results: ', results);
     console.log('stat: ' + stats);

    return result;
  }

  static async getAsset(cid: string): Promise<any> {

    for await (const file of this.node.get(cid)) {
      console.log('File path: ', file.path)

      if (!file.content) continue;

      const content = new BufferList() 

      for await (const chunk of file.content) {
        content.append(chunk)
      }

      console.log('Content: ', content.toString())


      return content
    }
  }

  static async getCID(path: string): Promise<string> {

    const stat = await this.node.files.stat(path);

    
    console.log('GET CID: ', stat['cid'])

    return stat
  } 
}

