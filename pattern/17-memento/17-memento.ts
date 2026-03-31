import Table from 'cli-table3';
import chalk from 'chalk';

// + ------------------ Originator -------------------- + //
class Cell {
  private value: string;
  private textColor: string;

  constructor(value: string, textColor: string) {
    this.value = value;
    this.textColor = textColor;
  }

  getValue(): string {
    return this.value;
  }

  getTextColor(): string {
    return this.textColor;
  }
}

class Sheet {
  private sheetName: string;
  private table: Cell[][];

  constructor(sheetName: string) {
    this.sheetName = sheetName;
    this.table = [];
  }

  save(): Memento {
    const tableCopy = this.table.map(row => row.map(cell => new Cell(cell.getValue(), cell.getTextColor())));

    return new SheetMemento(tableCopy);
  }

  restore(sheet: Memento): void {
    const sheetMemento = sheet as SheetMemento;

    this.table = sheetMemento.getTable();
  }

  setName(name: string): void {
    this.sheetName = name;
  }

  getName(): string {
    return this.sheetName;
  }

  editCell(row: number, column: number, value: string, textColor: string): void {
    if (this.table.length <= row) {
      for (let i = this.table.length; i <= row; i++) {
        this.table.push([]);
      }
    }

    if (this.table[row]!.length <= column) {
      for (let i = this.table[row]!.length; i <= column; i++) {
        this.table[row]!.push(new Cell('', 'black'));
      }
    }

    this.table[row]![column] = new Cell(value, textColor);
  }

  showTable(): void {
    if (this.table.length === 0) {
      console.log('ไม่มีข้อมูลใน Sheet นี้'); 
      return;
    }

    const table = new Table({
      head: this.table[0]!.map((cell: Cell) => chalk.hex(cell.getTextColor())(cell.getValue()))
    });
    

    for (let i = 1; i < this.table.length; i++) {
      const row = this.table[i]!.map((cell: Cell) => chalk.hex(cell.getTextColor())(cell.getValue()));
      table.push(row);
    }

    console.log(table.toString());
  }
}

// + -------------------- Memento -------------------- + //
interface Memento {

}

// + --------------- Concrete Memento --------------- + //
class SheetMemento implements Memento {
  private date: number;
  private table: Cell[][];

  constructor(table: Cell[][]) {
    this.date = new Date().getTime();
    this.table = table;
  }

  getTable(): Cell[][] {
    return this.table;
  }

  getDate(): number {
    return this.date;
  }
}

// + ------------------ Caretaker -------------------- + //
class GoogleSheet {
  private history: Memento[];
  private originator: Sheet;

  constructor(originator: Sheet) {
    this.history = [];
    this.originator = originator;
  }

  addHistory(): void {
    this.history.push(this.originator.save());
  }

  undo(version: number): void {
    if (this.history.length <= version) throw new Error('ไม่พบเวอร์ชันที่ต้องการ');

    const memento = this.history.splice(version, 1)[0]!;

    this.originator.restore(memento);
    this.originator.showTable();
  }

  showHistory(): void {
    const table = new Table({
      head: ['Version', 'History Date'],
    });

    this.history.forEach((memento, index) => {
      const sheetMemento = memento as SheetMemento;
      const date = new Date(sheetMemento.getDate());
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');

      table.push([index, `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`]);
    });

    console.log('\n==================== ประวัติการแก้ไข ====================\n');
    console.log(`  ชื่อ Sheet: ${this.originator.getName()}`);
    console.log(`\n------------------------------------------------------\n`);
    console.log(table.toString());
    console.log('\n======================================================\n');
  }
}

// + -------------------- Client --------------------- + //
const sheet = new Sheet('My Sheet');
const googleSheet = new GoogleSheet(sheet);

console.log('\n-------------------- Version 0 --------------------\n');


sheet.editCell(0, 0, 'District', '#FFFF00');
sheet.editCell(0, 1, 'Zip Code', '#00fffF');

sheet.editCell(1, 0, 'Bang Khun Thian', '#FFFFFF');
sheet.editCell(1, 1, '10150', '#FFFFFF');

sheet.showTable();

googleSheet.addHistory();

console.log('\n-------------------- Version 1 --------------------\n');
sheet.editCell(1, 0, 'Bang Khun Thian', '#FFFF00');
sheet.editCell(1, 1, '10150', '#00fffF');
sheet.showTable();

googleSheet.addHistory();

console.log('\n-------------------- Version 2 --------------------\n');
sheet.editCell(2, 0, 'Thonburi', '#FFFF00');
sheet.editCell(2, 1, '10600', '#00fffF');
sheet.showTable();

googleSheet.addHistory();

googleSheet.showHistory();

console.log('\n----------------- กลับไป Version 0 -----------------\n');
googleSheet.undo(0);