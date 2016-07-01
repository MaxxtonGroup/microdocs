/**
 * @author Steven Hermans
 */
export class TreeNode {

    constructor(public parent:TreeNode = null,
                public children:{[title:string]:TreeNode} = {},
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
        for (var key in this.children) {
            if (key == title && this.children[key].version == version) {
                return "/" + title;
            }
            var path = this.children[key].findNodePath(title, version);
            if (path != null) {
                return "/" + title + path;
            }
        }
        return null;
    }

}