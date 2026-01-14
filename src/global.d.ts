declare namespace JSX {
  interface IntrinsicElements {
    // allow arbitrary props on <style> to support `style jsx` used in some files
    style: any;
  }
}

// allow NodeJS namespace when @types/node is installed
declare namespace NodeJS {
  interface Timeout {}
}
