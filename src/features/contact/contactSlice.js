import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const STORAGE_KEY = 'nexus-contact-draft';

export const sendContact = createAsyncThunk(
  'contact/send',
  async (formData, { rejectWithValue }) => {
    const endpoint = import.meta.env.VITE_FORM_ENDPOINT;
    if (!endpoint) {
      return rejectWithValue('Не указан адрес сервиса отправки. Добавьте VITE_FORM_ENDPOINT в файл .env.');
    }

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error(`Сервис вернул ошибку (${response.status}).`);
      }
      return await response.json().catch(() => ({ ok: true }));
    } catch (error) {
      return rejectWithValue(error.message || 'Не удалось отправить форму. Проверьте соединение.');
    }
  }
);

const initialDraft = (() => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : { name: '', email: '', service: 'Сайт под ключ', message: '' };
  } catch {
    return { name: '', email: '', service: 'Сайт под ключ', message: '' };
  }
})();

const contactSlice = createSlice({
  name: 'contact',
  initialState: {
    draft: initialDraft,
    status: 'idle',
    error: '',
    success: false
  },
  reducers: {
    updateDraft(state, action) {
      state.draft = { ...state.draft, ...action.payload };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state.draft));
      } catch {
        // Хранилище может быть недоступно в приватном режиме браузера.
      }
      state.error = '';
      state.success = false;
    },
    resetFeedback(state) {
      state.error = '';
      state.success = false;
      state.status = 'idle';
    }
  },
  extraReducers(builder) {
    builder
      .addCase(sendContact.pending, (state) => {
        state.status = 'loading';
        state.error = '';
        state.success = false;
      })
      .addCase(sendContact.fulfilled, (state) => {
        state.status = 'succeeded';
        state.success = true;
        state.draft = { name: '', email: '', service: 'Сайт под ключ', message: '' };
        try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
      })
      .addCase(sendContact.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Ошибка отправки. Попробуйте ещё раз.';
      });
  }
});

export const { updateDraft, resetFeedback } = contactSlice.actions;
export default contactSlice.reducer;