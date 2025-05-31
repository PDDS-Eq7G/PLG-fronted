
export type CellType = 'empty' | 'central' | 'intermediate' | 'truck';

export interface GridCellData {

    x: number;
    y: number;
    type: CellType;
    id?: string; 
}