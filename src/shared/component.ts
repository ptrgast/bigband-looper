export default class Component {

    private root;

    public constructor(private type: string="div", private className?: string) {
        this.root = document.createElement(type);        
        this.root.className = "component " + (this.className != null ? this.className : "");
    }

    public setContent(content:string):void {
        this.root.innerHTML = content;
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