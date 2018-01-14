export default class Component {

    private root;
    private pane;

    public constructor(private type: string="div", private className?: string) {
        this.root = document.createElement(type);        
        this.root.className = this.className != null ? this.className : "";
        this.pane = document.createElement("div");        
        this.pane.className = "pane";

        this.root.appendChild(this.pane);
    }

    public setContent(content:string):void {
        this.pane.innerHTML = content;
    }

    public getByClass(className:string) {
        var elements = this.root.getElementsByClassName(className);
        if (elements.length==1) {
            elements = elements[0];
        }
        return elements;
    }

    public getRoot() {
        return this.root;
    }

    public appendTo(element) {
        if (typeof element=="string") {
            var container = document.getElementById(element);
            container.appendChild(this.root);
        } else {
            element.appendChild(this.root);
        }
    }

}