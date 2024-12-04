declare module 'jspdf-autotable' {
    interface AutoTableStyles {
      font?: string; // Имя шрифта
      fontSize?: number; // Размер шрифта
      textColor?: string | number; // Цвет текста
      fillColor?: string | number; // Цвет фона
      lineColor?: string | number; // Цвет линии
      lineWidth?: number; // Толщина линии
    }
  
    interface AutoTableTheme {
      theme?: 'striped' | 'grid' | 'plain'; // Тема таблицы
    }
  
    interface AutoTableOptions extends AutoTableTheme {
      head: string[][];
      body: (string | number)[][];
      startY?: number; // Начало таблицы по оси Y
      margin?: { top?: number; right?: number; bottom?: number; left?: number }; // Отступы
      styles?: AutoTableStyles; // Общие стили
      headStyles?: AutoTableStyles; // Стили для заголовков
      bodyStyles?: AutoTableStyles; // Стили для строк данных
      alternateRowStyles?: AutoTableStyles; // Стили для чередующихся строк
      columnStyles?: { [key: number]: AutoTableStyles }; // Стили для определённых столбцов
    }
  
    interface jsPDF {
      autoTable: (options: AutoTableOptions) => void;
    }
  }
  