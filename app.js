 let groupMembers = [{ name: '', id: '' }];
let submissionType = 'individual';
 const $ = id => document.getElementById(id);
 function toggleEditor(visible) {
  $('editor-pane').classList.toggle('collapsed', !visible);
  $('floating-show-btn').style.display = visible ? 'none' : 'block';
}

$('inline-hide-btn').addEventListener('click', () => toggleEditor(false));
$('floating-show-btn').addEventListener('click', () => toggleEditor(true));
 $('left-margin').addEventListener('input', function() {
  const val = parseFloat(this.value);
  $('left-margin-display').textContent = val.toFixed(2) + ' in';
  $('page-content').style.left = (val * 96) + 'px';
});
 document.querySelectorAll('input[name="sub-type"]').forEach(radio => {
  radio.addEventListener('change', function() {
    submissionType = this.value;
    $('individual-section').style.display = submissionType === 'individual' ? '' : 'none';
    $('group-section').style.display = submissionType === 'group' ? '' : 'none';
    updatePreview();
  });
});
 function renderMemberRows() {
  const container = $('group-members-section');
  container.innerHTML = '';
  groupMembers.forEach((m, i) => {
    const row = document.createElement('div');
    row.className = 'member-row';
    row.innerHTML = `
      <input type="text" placeholder="Name" value="${escHtml(m.name)}" data-i="${i}" data-field="name" />
      <input type="text" placeholder="ID" value="${escHtml(m.id)}" data-i="${i}" data-field="id" style="max-width:125px;" />
      ${groupMembers.length > 1 ? `<button data-remove="${i}" title="Remove Roster Position">✕</button>` : ''}
    `;
    container.appendChild(row);
  });
  
  container.querySelectorAll('input').forEach(inp => {
    inp.addEventListener('input', function() {
      groupMembers[this.dataset.i][this.dataset.field] = this.value;
      updatePreview();
    });
  });
  
  container.querySelectorAll('[data-remove]').forEach(btn => {
    btn.addEventListener('click', function() {
      groupMembers.splice(parseInt(this.dataset.remove), 1);
      renderMemberRows();
      updatePreview();
    });
  });
}

$('add-member-btn').addEventListener('click', () => {
  groupMembers.push({ name: '', id: '' });
  renderMemberRows();
  updatePreview();
});

renderMemberRows();
 const inputTargetList = [
  'assignment-type','assignment-title','course-code','course-title',
  'section','semester','faculty-name','faculty-designation','faculty-department',
  'student-name','student-id','student-dept','submission-date'
];
inputTargetList.forEach(id => {
  $(id)?.addEventListener('input', updatePreview);
  $(id)?.addEventListener('change', updatePreview);
});
 function formatDate(val) {
  if (!val) return '—';
  const d = new Date(val + 'T00:00:00');
  const day = d.getDate();
  const months = ['January','February','March','April','May','June',
                  'July','August','September','October','November','December'];
  return `${day} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function escHtml(s) {
  return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}
 function updatePreview() {
  const atype = $('assignment-type').value.trim() || 'ASSIGNMENT';
  const atitle = $('assignment-title').value.trim() || 'TITLE OF THE ASSIGNMENT';
  const code = $('course-code').value.trim() || 'COURSE CODE';
  const ctitle = $('course-title').value.trim() || 'COURSE TITLE';
  const sec = $('section').value.trim();
  const sem = $('semester').value.trim() || 'SEMESTER';
  const fname = $('faculty-name').value.trim();
  const fdes = $('faculty-designation').value.trim();
  const fdept = $('faculty-department').value.trim();
  const date = $('submission-date').value;

  $('preview-atype').textContent = atype.toUpperCase();
  $('preview-atitle').textContent = atitle.toUpperCase();
  $('preview-code').textContent = code.toUpperCase();
  $('preview-title').textContent = ctitle.toUpperCase();      if (submissionType === 'group') {
    $('preview-sec').textContent = sec ? `GRP ${sec}` : 'GRP —';     } else {
    $('preview-sec').textContent = 'SEC ' + (sec || '—');
    }
    $('preview-semester').textContent = sem.toUpperCase();

    const uniName = window.UNIVERSITY_NAME || 'North South University';

    let facultyHtml = '';
  if (fname) facultyHtml += escHtml(fname) + '<br>';
  if (fdes) facultyHtml += escHtml(fdes) + '<br>';
  if (fdept) facultyHtml += escHtml(fdept) + '<br>';
  facultyHtml += escHtml(uniName);   $('preview-faculty').innerHTML = facultyHtml;

    if (submissionType === 'individual') {
    const sname = $('student-name').value.trim();
    const sid = $('student-id').value.trim();
    const sdept = $('student-dept').value.trim();
    let byHtml = '';
    if (sname) byHtml += escHtml(sname) + '<br>';
    if (sid) byHtml += escHtml(sid) + '<br>';
    if (sdept) byHtml += escHtml(sdept) + '<br>';
    byHtml += escHtml(uniName);     $('preview-student').innerHTML = byHtml;
  } else {
    let byHtml = '';
    groupMembers.forEach(m => {
      if (m.name || m.id) {
        if (m.name) byHtml += escHtml(m.name) + '<br>';
        if (m.id) byHtml += escHtml(m.id) + '<br>';
      }
    });
    if (!byHtml) byHtml = '—';
    $('preview-student').innerHTML = byHtml;
  }

  $('preview-date').textContent = formatDate(date);
}
 updatePreview();
document.getElementById('save-json-btn').addEventListener('click', () => {
    const assignmentTypeInput = document.getElementById('assignment-type').value.trim();
  const courseCodeInput = document.getElementById('course-code').value.trim();

    const assignmentType = assignmentTypeInput ? assignmentTypeInput.toLowerCase() : 'assignment';
  const courseCode = courseCodeInput ? courseCodeInput.toLowerCase() : 'cover';
  const generatedFileName = `${assignmentType}_${courseCode}.json`;

      const coverData = {
    assignmentType: document.getElementById('assignment-type').value,
    assignmentTitle: document.getElementById('assignment-title').value,
    courseCode: document.getElementById('course-code').value,
    courseTitle: document.getElementById('course-title').value,
    section: document.getElementById('section').value,
    semester: document.getElementById('semester').value,
    facultyName: document.getElementById('faculty-name').value,
    facultyDesignation: document.getElementById('faculty-designation').value,
    facultyDepartment: document.getElementById('faculty-department').value,
    submissionDate: document.getElementById('submission-date').value,
      };

    const jsonString = JSON.stringify(coverData, null, 2);
  
    const blob = new Blob([jsonString], { type: 'application/json' });
  const link = document.createElement('a');
  
  link.href = URL.createObjectURL(blob);
  link.download = generatedFileName;   
    document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
});
 $('json-file-input').addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    try {
      const d = JSON.parse(ev.target.result);
      const set = (id, val) => { if ($(id) && val !== undefined) $(id).value = val; };
      
      set('left-margin', d.leftMargin);
      if (d.leftMargin) {
        $('left-margin-display').textContent = parseFloat(d.leftMargin).toFixed(2) + ' in';
        $('page-content').style.left = (parseFloat(d.leftMargin) * 96) + 'px';
      }
      
      set('assignment-type', d.assignmentType);
      set('assignment-title', d.assignmentTitle);
      set('course-code', d.courseCode);
      set('course-title', d.courseTitle);
      set('section', d.section);
      set('semester', d.semester);
      set('faculty-name', d.facultyName);
      set('faculty-designation', d.facultyDesignation);
      set('faculty-department', d.facultyDepartment);
      set('student-name', d.studentName);
      set('student-id', d.studentId);
      set('student-dept', d.studentDept);
      set('submission-date', d.submissionDate);

      if (d.submissionType) {
        submissionType = d.submissionType;
        document.querySelectorAll('input[name="sub-type"]').forEach(r => {
          r.checked = (r.value === submissionType);
        });
        $('individual-section').style.display = submissionType === 'individual' ? '' : 'none';
        $('group-section').style.display = submissionType === 'group' ? '' : 'none';
      }

      if (d.groupMembers) {
        groupMembers = d.groupMembers;
        renderMemberRows();
      }

      updatePreview();
    } catch (err) {
      alert('Invalid configuration JSON schema blueprint structural rule framework.');
    }
  };
  reader.readAsText(file);
});
                            
document.getElementById('download-pdf-btn').addEventListener('click', () => {
    const assignmentTypeInput = document.getElementById('assignment-type').value.trim();
  const courseCodeInput = document.getElementById('course-code').value.trim();

    const assignmentType = assignmentTypeInput ? assignmentTypeInput.toLowerCase() : 'assignment';
  const courseCode = courseCodeInput ? courseCodeInput.toLowerCase() : 'cover';

    const generatedFileName = `${assignmentType}_${courseCode}`;

    const originalTitle = document.title;

    document.title = generatedFileName;

    window.print();

      setTimeout(() => {
    document.title = originalTitle;
  }, 100);
});
