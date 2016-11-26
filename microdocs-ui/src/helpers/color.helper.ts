
const colorRanges = {
  'pink': ['a', 'b'],
  'red': ['c', 'd'],
  'orange': ['e', 'f'],
  'amber': ['g', 'h'],
  'yellow': ['i', 'j'],
  'lime': ['k', 'l'],
  'green': ['m', 'n'],
  'teal': ['o', 'p'],
  'cyan': ['q', 'r'],
  'light-blue': ['s', 't'],
  'blue': ['u', 'v'],
  'indigo': ['w', 'x'],
  'purple': ['y', 'z']
};

export function getColorByTitle(title:string):string {
  let selectedColor:string;
  var first = title.substr(0, 1);
  for (var color in colorRanges) {
    colorRanges[color].forEach((char:string) => {
      if (char === first) {
        selectedColor = color;
        return false;
      }
    });
    if (selectedColor) {
      return selectedColor;
    }
  }
  return 'blue-gray';
}