/**
* Batch processor for processing activated document requirements
*/
global with sharing class SQX_Activated_Requirement_Processor implements Database.Batchable<sObject> {
    
    // batch size that can be processed
    global static final Integer BATCH_SIZE = 1;
    //Instance specific configurable variable for batch job name
    global String JOB_NAME = 'CQ-Activated Requirement Training Processor'; //NOPMD
    //Instance specific configurable variable for next schedule in minutes
    global Integer SCHEDULE_AFTER_MIN = 1; //NOPMD
    
    //this flag can be used in tests to disable rescheduling
    //for normal usage this value is always true, for tests it is set to false but can be changed
    global boolean RESCHEDULE = !Test.isRunningTest(); //NOPMD
    
    // used as max limit, when greater than zero, to generate trainings using SQX_Personnel_Document_Job_Function
    private Integer pjfsLimitToUse = 0;
    
    /**
    * checks and sets max pjfs limit during training generation
    */
    global void setMaxPJFsToProcess(Integer pjfsLimit) {
        Integer maxLimit = Limits.getLimitDMLRows() / 2; // PDJF and PDT records are created for each PJF
        System.assert(pjfsLimit > 0 && pjfsLimit < maxLimit, 'Total personnel job functions to process must be positive integer less than ' + maxLimit + ' to avoid SF DML rows limit.');
        pjfsLimitToUse = pjfsLimit;
    }
    
    /**
    * Returns the query that will fetch all the activated document requirements pending training generation
    */
    global Database.QueryLocator start(Database.BatchableContext bc) {
        Id templateDocumentRecordTypeId = SQX_Controlled_Document.getTemplateDocTypeId();
        
        return Database.getQueryLocator([
            SELECT Id,
                SQX_Controlled_Document__c,
                SQX_Job_Function__c,
                SQX_Controlled_Document__r.Document_Number__c,
                Skip_Revision_Training__c,
                SQX_Initial_Assessment__c,
                SQX_Revision_Assessment__c,
                SQX_Controlled_Document__r.SQX_Initial_Assessment__c,
                SQX_Controlled_Document__r.SQX_Revision_Assessment__c,
                Training_Job_Last_Processed_Record__c,
                Training_Job_Error__c,
                Training_Program_Step_Internal__c
            FROM SQX_Requirement__c
            WHERE Active__c = true
                AND Training_Job_Status__c = :SQX_Requirement.TRAINING_JOB_STATUS_ACTIVATION_PENDING
                AND SQX_Controlled_Document__r.RecordTypeId != :templateDocumentRecordTypeId
                AND SQX_Controlled_Document__r.Document_Status__c IN :SQX_Controlled_Document.VALID_DOCUMENT_STATUSES_FOR_TRAINING
            ORDER BY LastModifiedDate ASC, Training_Program_Step_Internal__c ASC
        ]);
    }
    
    /**
    * batch method that processes batch items
    */
    global void execute(Database.BatchableContext bc, List<sObject> scope) {
        processBatch((SQX_Requirement__c)scope.get(0));
    }
    
    /**
    * process batch item to generate PDJFs and document trainings
    */
    public void processBatch(SQX_Requirement__c req) {
        if (pjfsLimitToUse > 0) {
            SQX_Personnel_Document_Job_Function.maxRecordsToProcessByTrainingBatchJob  = pjfsLimitToUse;
        }
        SQX_Personnel_Document_Job_Function.processActivatedRequirementUsingBatch(req);
    }
    
    /**
    * method is called by the batch executor to perform cleanups. In case of CQ this method reschedules the batch job processing staging
    */
    global void finish(Database.BatchableContext bc) {
        // reschedule job
        if (RESCHEDULE) {
            SQX_Activated_Requirement_Processor processor = new SQX_Activated_Requirement_Processor();
            processor.JOB_NAME = JOB_NAME;
            processor.RESCHEDULE = RESCHEDULE;
            processor.SCHEDULE_AFTER_MIN = SCHEDULE_AFTER_MIN;
            if (pjfsLimitToUse > 0) {
                processor.setMaxPJFsToProcess(pjfsLimitToUse);
            }
            
            System.scheduleBatch(processor, JOB_NAME, SCHEDULE_AFTER_MIN, BATCH_SIZE);
        }
    }
}