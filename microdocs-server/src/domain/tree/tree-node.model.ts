
/**
 * @author Steven Hermans
 */
export class TreeNode {

    constructor(public parent:TreeNode = null,
                public dependencies:{[title:string]:TreeNode} = {},
                public group?:string,
                public version?:string,
                public versions?:string[],
                public reference?:string) {
    }

    public getRoot():TreeNode {
        if (this.parent != null) {
            return this.parent.getRoot();
        }
        return this;
    }

    public findNodePath(title:string, version:string):string {
        for (var key in this.dependencies) {
            if (key == title && this.dependencies[key].version == version) {
                return "/dependencies/" + title;
            }
            var path = this.dependencies[key].findNodePath(title, version);
            if (path != null) {
                return "/dependencies/" + title + path;
            }
        }
        return null;
    }


    public unlink() : {}{
        var dependencies:{[title:string]:{}} = {};
        for (var key in this.dependencies) {
            var child = this.dependencies[key];
            dependencies[key] = child.unlink();
        }
        var node = {};
        if(Object.keys(dependencies).length > 0){
            node['dependencies'] = dependencies;
        }
        if(this.group != null || this.group != undefined){
            node['group'] = this.group;
        }
        if(this.version != null || this.version != undefined){
            node['version'] = this.version;
        }
        if(this.versions != null || this.versions != undefined){
            node['versions'] = this.versions;
        }
        if(this.reference != null || this.reference != undefined){
            node['reference'] = this.reference;
        }
        return node;
    }

    public static link(unlinkedNode:{}):TreeNode{
        //todo: link nodes
        return null;
    }

}