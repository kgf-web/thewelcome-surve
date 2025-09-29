'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import { supabase } from '../utils/supabase';

type HelpfulAIFeatures = string[];

export default function SurveyPage() {
  const [department, setDepartment] = useState('');
  const [primaryRole, setPrimaryRole] = useState('');
  const [repetitiveTasks, setRepetitiveTasks] = useState('');
  const [dataWorkHours, setDataWorkHours] = useState('');
  const [dataWorkExamples, setDataWorkExamples] = useState('');
  const [documentWorkExamples, setDocumentWorkExamples] = useState('');
  const [infoSearchDifficulty, setInfoSearchDifficulty] = useState('');
  const [aiAssistantTasks, setAiAssistantTasks] = useState('');
  const [helpfulAiFeatures, setHelpfulAiFeatures] = useState<HelpfulAIFeatures>([]);
  const [otherFeature, setOtherFeature] = useState('');
  const [chatgptExperience, setChatgptExperience] = useState('');
  const [chatgptLimit, setChatgptLimit] = useState('');
  const [willingnessToLearn, setWillingnessToLearn] = useState('');
  const [concerns, setConcerns] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleFeatureChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    if (checked) {
      setHelpfulAiFeatures(prev => [...prev, value]);
    } else {
      setHelpfulAiFeatures(prev => prev.filter(item => item !== value));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    const finalFeatures = otherFeature ? [...helpfulAiFeatures, `기타: ${otherFeature}`] : helpfulAiFeatures;

    const { error } = await supabase.from('survey_responses').insert([{
      department,
      primary_role: primaryRole,
      repetitive_tasks: repetitiveTasks,
      data_work_hours: dataWorkHours,
      data_work_examples: dataWorkExamples,
      document_work_examples: documentWorkExamples,
      info_search_difficulty: infoSearchDifficulty,
      ai_assistant_tasks: aiAssistantTasks,
      helpful_ai_features: finalFeatures,
      chatgpt_experience: chatgptExperience,
      chatgpt_limitations: chatgptLimit,
      willingness_to_learn: willingnessToLearn,
      concerns,
    }]);

    setIsSubmitting(false);
    if (error) {
      setSubmitMessage(`오류가 발생했습니다: ${error.message}`);
    } else {
      setSubmitMessage('설문에 참여해 주셔서 진심으로 감사합니다!');
    }
  };

  const renderRadioGroup = (question: string, options: string[], value: string, setter: (val: string) => void, number: string) => (
    <div className="mb-8">
      <label className="block text-base font-medium text-gray-800 mb-3">{number}. {question}</label>
      <div className="space-y-2">
        {options.map(option => {
          const isChecked = value === option;
          return (
            <label key={option} className={`flex items-center space-x-3 p-3 rounded-md border transition-colors duration-200 cursor-pointer ${isChecked ? 'bg-gray-100 border-gray-300' : 'bg-white border-gray-200 hover:bg-gray-50'}`}>
              <input type="radio" name={number} value={option} checked={isChecked} onChange={e => setter(e.target.value)} className="h-4 w-4 text-gray-800 focus:ring-gray-500 border-gray-300" />
              <span className={`font-normal ${isChecked ? 'text-gray-900' : 'text-gray-700'}`}>{option}</span>
            </label>
          )
        })}
      </div>
    </div>
  );

  const FormSection = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="py-6">
      <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-3 mb-6">{title}</h2>
      {children}
    </div>
  );

  const FormField = ({ number, label, children }: { number: string, label: string, children: React.ReactNode }) => (
    <div className="mb-8">
      <label htmlFor={number} className="block text-base font-medium text-gray-800 mb-3">{number}. {label}</label>
      {children}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-[780px] w-full bg-white p-8 sm:p-10 rounded-lg border border-gray-200">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900">더웰컴 AI 도입 설문</h1>
          <p className="mt-3 text-gray-500">미래 성장을 위한 여러분의 소중한 의견을 들려주세요.</p>
        </div>

        {submitMessage ? (
          <div className={`text-center p-6 rounded-md ${submitMessage.includes('오류') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
            <p className="font-medium text-lg">{submitMessage}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="divide-y divide-gray-200">
            <FormSection title="PART 1. 응답자 정보">
              {renderRadioGroup('소속 본부/실을 선택해 주세요.', ['글로벌 전시본부', '글로벌 비즈본부', '기획행사실', '크리에이티브실 / 디자인 연구소', 'HM실 (경영지원)'], department, setDepartment, '1')}
              <FormField number="2" label="현재 담당하고 계신 주된 직무를 간략히 기재해 주세요.">
                <input id="2" type="text" value={primaryRole} onChange={e => setPrimaryRole(e.target.value)} placeholder="예: CES 서울관 PM, 글로벌 연수 기획" className="w-full p-3 bg-white border border-gray-300 rounded-md focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition duration-150 ease-in-out" />
              </FormField>
            </FormSection>

            <FormSection title="PART 2. 현재 업무 분석">
              <FormField number="3" label="현재 업무 중, 가장 많은 시간을 차지하는 반복적인 수작업이 있다면 무엇인가요? (3가지 이내)">
                <textarea id="3" value={repetitiveTasks} onChange={e => setRepetitiveTasks(e.target.value)} rows={3} placeholder="예: 매주/매월 작성하는 실적 보고서 데이터 취합, 프로젝트별 정산 증빙 서류 정리 등" className="w-full p-3 bg-white border border-gray-300 rounded-md focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition duration-150 ease-in-out"></textarea>
              </FormField>
              {renderRadioGroup('데이터 수집, 분석, 보고와 관련된 업무에 주당 평균 몇 시간 정도를 사용하시나요?', ['1시간 미만', '1~3시간', '3~5시간', '5~10시간', '10시간 이상'], dataWorkHours, setDataWorkHours, '4')}
              <FormField number="5" label="위 4번과 같은 데이터 관련 업무는 주로 무엇인가요? 구체적인 사례를 들어주세요.">
                 <textarea id="5" value={dataWorkExamples} onChange={e => setDataWorkExamples(e.target.value)} rows={3} placeholder="예: 행사 종료 후 만족도 조사 결과 분석, 특정 산업/기술 관련 시장 동향 리서치 및 요약 등" className="w-full p-3 bg-white border border-gray-300 rounded-md focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition duration-150 ease-in-out"></textarea>
              </FormField>
              <FormField number="6" label="기획서, 제안서, 보고서, 이메일 등 문서를 작성하거나, 발표 자료(PPT)를 만드는 데 많은 시간을 쏟는 업무는 무엇인가요?">
                 <textarea id="6" value={documentWorkExamples} onChange={e => setDocumentWorkExamples(e.target.value)} rows={3} placeholder="예: 신규 사업 제안서 초안 작성, 클라이언트 대상 주간 보고 이메일 작성 등" className="w-full p-3 bg-white border border-gray-300 rounded-md focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition duration-150 ease-in-out"></textarea>
              </FormField>
              <FormField number="7" label="과거 프로젝트 자료, 사내 규정, 담당자 정보 등 업무에 필요한 정보를 찾기 위해 시간을 많이 사용하거나 어려움을 겪은 경험이 있으신가요?">
                 <textarea id="7" value={infoSearchDifficulty} onChange={e => setInfoSearchDifficulty(e.target.value)} rows={3} placeholder="어떤 종류의 정보였는지 구체적으로 작성해주세요." className="w-full p-3 bg-white border border-gray-300 rounded-md focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition duration-150 ease-in-out"></textarea>
              </FormField>
            </FormSection>

            <FormSection title="PART 3. AI 도입에 대한 아이디어">
               <FormField number="8" label="만약 나만의 AI 어시스턴트가 생긴다면, 현재 업무 중 어떤 부분을 가장 먼저 맡기고 싶으신가요?">
                <textarea id="8" value={aiAssistantTasks} onChange={e => setAiAssistantTasks(e.target.value)} rows={3} placeholder="'똑똑한 신입사원'이라 가정하고 자유롭게 상상하여 답변해주세요." className="w-full p-3 bg-white border border-gray-300 rounded-md focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition duration-150 ease-in-out"></textarea>
              </FormField>
              <div className="mb-8">
                <label className="block text-base font-medium text-gray-800 mb-3">9. 다음 중 AI 기술이 도입되었을 때, 본인의 업무에 가장 도움이 될 것 같은 기능을 모두 선택해 주세요.</label>
                <div className="space-y-2">
                  {[ '[문서 자동화] 제안서, 보고서, 기사 등 초안 자동 작성 및 요약', '[디자인 보조] 발표자료, 홍보물 등 디자인 시안 자동 생성', '[데이터 분석] 시장/고객 데이터 분석 및 트렌드 예측', '[정보 검색] 사내 문서 및 과거 프로젝트 정보 기반 질의응답', '[번역/통역] 외국어 이메일 작성, 해외 자료 번역, 실시간 통역 지원', '[개인화 추천] 행사 참가자 대상 맞춤형 세션/네트워킹 추천'].map(option => {
                    const isChecked = helpfulAiFeatures.includes(option);
                    return (
                      <label key={option} className={`flex items-center space-x-3 p-3 rounded-md border transition-colors duration-200 cursor-pointer ${isChecked ? 'bg-gray-100 border-gray-300' : 'bg-white border-gray-200 hover:bg-gray-50'}`}>
                        <input type="checkbox" value={option} checked={isChecked} onChange={handleFeatureChange} className="h-4 w-4 text-gray-800 focus:ring-gray-500 border-gray-300 rounded" />
                        <span className={`font-normal ${isChecked ? 'text-gray-900' : 'text-gray-700'}`}>{option}</span>
                      </label>
                    )
                  })}
                  <div className="flex items-center space-x-3 p-3 rounded-md border border-gray-200 bg-white">
                     <input type="checkbox" id="other-checkbox" onChange={e => { if(!e.target.checked) setOtherFeature('') }} className="h-4 w-4 text-gray-800 focus:ring-gray-500 border-gray-300 rounded" />
                     <label htmlFor="other-feature" className="font-normal text-gray-700">기타:</label>
                     <input id="other-feature" type="text" value={otherFeature} onChange={e => setOtherFeature(e.target.value)} className="flex-grow p-2 bg-white border-gray-300 rounded-md focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition" />
                  </div>
                </div>
              </div>
            </FormSection>

            <FormSection title="PART 4. AI 기술 수용도 및 우려사항">
              {renderRadioGroup('ChatGPT를 업무에 사용해 본 경험이 있으신가요?', ['업무에 적극적으로 활용하고 있다.', '업무에 가끔 사용해 본다.', '개인적인 용도로만 사용해 봤다.', '사용해 본 적 없다.'], chatgptExperience, setChatgptExperience, '10')}
              {(chatgptExperience.includes('업무')) && (
                <FormField number="11" label="ChatGPT를 업무에 활용하면서 느꼈던 한계점이나 아쉬웠던 점은 무엇이었나요?">
                  <textarea id="11" value={chatgptLimit} onChange={e => setChatgptLimit(e.target.value)} rows={3} placeholder="예: 최신 정보나 특정 산업 분야 답변의 정확성이 떨어짐, 내부 자료 기반으로 답변을 생성하지 못함 등" className="w-full p-3 bg-white border border-gray-300 rounded-md focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition duration-150 ease-in-out"></textarea>
                </FormField>
              )}
              {renderRadioGroup('회사에서 새로운 AI 기술이나 툴을 도입한다면, 배우고 활용할 의향이 있으신가요?', ['매우 그렇다', '그렇다', '보통이다', '그렇지 않다', '전혀 그렇지 않다'], willingnessToLearn, setWillingnessToLearn, '12')}
              <FormField number="13" label="업무에 AI를 도입하는 것에 대해 우려되는 점이 있다면 자유롭게 말씀해 주세요.">
                <textarea id="13" value={concerns} onChange={e => setConcerns(e.target.value)} rows={3} placeholder="예: 내 일자리가 줄어들 것 같다, AI가 만든 결과물을 믿을 수 있을지 걱정된다 등" className="w-full p-3 bg-white border border-gray-300 rounded-md focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition duration-150 ease-in-out"></textarea>
              </FormField>
            </FormSection>

            <div className="text-center pt-8">
              <button type="submit" disabled={isSubmitting} className="w-full max-w-sm bg-gray-800 text-white font-semibold py-3 px-6 rounded-md shadow-sm hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-300">
                {isSubmitting ? '제출 중...' : '설문 완료 및 제출'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
