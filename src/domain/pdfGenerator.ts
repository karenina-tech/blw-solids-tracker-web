import type { ChecklistItem } from '@/types/checklist';
import { TOOL_MESSAGES } from '@/data/toolMessages';
import { CHECKLIST_TEMPLATE } from '@/templates/checklistTemplate';
import { formatDate, formatOrdinalDate } from '@/utils/formatDate';

export function compileHtmlTemplate(babyName: string, startDate: string, items: ChecklistItem[]): string {
  const tableRowsHtml = items
    .map((item) => {
      const isAllergen = item.category.startsWith('Allergen');
      const badgeClass = isAllergen ? 'badge-allergen' : 'badge-standard';
      const [foodName, ...prepParts] = item.foodItem.split(' — ');
      const preparation = prepParts.join(' — ');
      return `
      <tr>
        <td class="col-date">${formatOrdinalDate(item.date)}</td>
        <td class="col-food">
          <span class="food-name">${foodName}</span>${preparation ? `<span class="food-prep">${preparation}</span>` : ''}
        </td>
        <td class="col-cat"><span class="badge ${badgeClass}">${item.category}</span></td>
        <td class="col-chk"></td>
        <td class="col-notes"></td>
      </tr>`;
    })
    .join('');

  return CHECKLIST_TEMPLATE
    .replace('{{BABY_NAME}}', babyName)
    .replace('{{START_DATE}}', formatDate(startDate))
    .replace('{{TABLE_ROWS}}', tableRowsHtml)
    .replace('{{TOOL_MESSAGES.ALLERGY_WARNING}}', TOOL_MESSAGES.ALLERGY_WARNING)
    .replace('{{TOOL_MESSAGES.DISCLAIMER}}', TOOL_MESSAGES.DISCLAIMER)
    .replace('{{MONITORING_INSTRUCTIONS}}', TOOL_MESSAGES.MONITORING_INSTRUCTIONS);
}
