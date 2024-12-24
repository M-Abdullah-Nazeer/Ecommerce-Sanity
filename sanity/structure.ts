import type {StructureResolver} from 'sanity/structure'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('MAN Ecommerce Site')
    .items([
      S.documentTypeListItem('category').title('Category'),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) => item.getId() && !['post', 'category'].includes(item.getId()!),
      ),
    ])
