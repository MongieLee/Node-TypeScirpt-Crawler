//在构造函数的参数上使用public等同于创建了同名的成员变量。
class Student {
  fullName: string;
  constructor(
    public firstName: string,
    public middleInitial: string,
    public lastName: string
  ) {
    this.fullName = firstName + " " + middleInitial + " " + lastName;
  }
}

interface Person {
  firstName: string;
  lastName: string;
}

class MM {
  public name: string;
  constructor(name: string) {
    this.name = name;
  }
}

class KK {
  constructor(public name: string) {}
}

class OO extends KK {
  constructor(public age: number) {
    super("dell");
  }
}

console.log(new MM("dd"));
console.log(new KK("ss"));
console.log(new OO(123));

class Person {
  constructor(private _name: string) {}
  get name() {
    return this._name + "li";
  }
  set name(name: string) {
    //此处也可以做一些加密保护
    this._name = name;
  }
}
const aa = new Person("sdds");
console.log(aa.name);
aa.name = "kjljwelkjwkle";
console.log(aa.name);

class Demo {
  private constructor() {}
  private static instance: Demo;
  static init() {
    if (!this.instance) {
      this.instance = new Demo();
    }
    return this.instance;
  }
}

const demo1 = Demo.init();
const demo2 = Demo.init();
console.log(demo1);
console.log(demo2);
console.log(demo1 === demo2);

class On {
  constructor(public readonly _name: string) {}
}
const onnnn = new On("1212");
console.log(onnnn._name);

abstract class People {
  kk: number = 1;
  fuck() {
    return "fuck";
  }
  abstract getName(): number; //抽象类里的抽象属性
}
class Studen extends People {
  getName(): number {
    throw new Error("Method not implemented.");
  }
}
interface All {
  name: string;
}

interface Teacher extends All {
  age: number;
}

interface Sss extends All {
  ll: number;
}

const getName = (user: All): void => {
  console.log(user.name);
};

getName({ name: "1212" });
