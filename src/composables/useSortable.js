import { computed, ref } from 'vue';

export default function useSortable(
  items,
  defaultField = 'name',
  defaultOrder = 'asc',
  itemsPerPage = 20
) {
  const sortField = ref(defaultField);
  const sortOrder = ref(defaultOrder);
  const currentPage = ref(1);

  const sortedItems = computed(() => {
    return [...items.value].sort((a, b) => {
      let aField = a[sortField.value];
      let bField = b[sortField.value];

      if (sortField.value === 'marketPrice') {
        aField = parseFloat(aField) || 0;
        bField = parseFloat(bField) || 0;
      } else if (sortField.value === 'addedAt') {
        aField = aField ? new Date(aField) : new Date(0);
        bField = bField ? new Date(bField) : new Date(0);
      } else {
        aField = (aField || '').toString().toLowerCase();
        bField = (bField || '').toString().toLowerCase();
      }

      if (aField < bField) return sortOrder.value === 'asc' ? -1 : 1;
      if (aField > bField) return sortOrder.value === 'asc' ? 1 : -1;
      return 0;
    });
  });

  const paginatedItems = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    const end = currentPage.value * itemsPerPage;
    return sortedItems.value.slice(start, end);
  });

  const totalPages = computed(() => {
    return Math.ceil(sortedItems.value.length / itemsPerPage);
  });

  const handleSortChange = ({ field, order }) => {
    sortField.value = field;
    sortOrder.value = order;
    currentPage.value = 1; // Reset to first page when sorting changes
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page;
    }
  };

  return {
    sortField,
    sortOrder,
    currentPage,
    totalPages,
    sortedResults: sortedItems, // Omdøb sortedItems til sortedResults
    paginatedItems,
    handleSortChange,
    goToPage,
  };
}
